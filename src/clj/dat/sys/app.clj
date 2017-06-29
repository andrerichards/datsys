(ns dat.sys.app
  (:require [dat.spec.protocols :as protocols]
            [clojure.core.async :as async :refer [go go-loop]]
            [dat.sys.ws :as ws]
            [dat.sync.core :as dat.sync]
            [taoensso.timbre :as log :include-macros true]
            [com.stuartsierra.component :as component]
            [slingshot.slingshot :as slingshot :refer [throw+ try+]]
            [taoensso.sente :as sente]))



;; XXX TODO Need to clean up in terms of protocols

;; # Application

;; This namespace contains the core of the server's message handling logic.
;; Any custom message handlers on the server you want to hook up should go here


;; ## First we set up our event handler multimethod function, and a wrapper for it

(defmulti event-msg-handler
  ; Dispatch on event-id
  (fn [app {:as event-msg :keys [id]}] id))

;; Wrap with middleware instead
;(defn event-msg-handler* [app {:as event-msg :keys [id ?data event]}]
  ;(try+
    ;(event-msg-handler event-msg app)
    ;(catch Object e
      ;(log/error "failed to run message handler!")
      ;(.printStackTrace e)
      ;(throw+))))



;; ## Event handlers

;; don't really need this... should delete
(defmethod event-msg-handler :chsk/ws-ping
  [_ _]
;;   (log/debug "Ping")
  )

;; Setting up our two main dat.sync hooks

;; General purpose transaction handler
(defmethod event-msg-handler :dat.sync.remote/tx
  [{:as app :keys [datomic]} {:as event-msg :keys [id ?data]}]
  (log/info "tx recieved from client: " id)
  (let [tx-report @(dat.sync/apply-remote-tx! (:conn datomic) ?data)]
    (println "Do something with:" tx-report)))

;; We handle the bootstrap message by simply sending back the bootstrap data
(defmethod event-msg-handler :dat.sync.client/bootstrap
  ;; What is send-fn here? Does that wrap the uid for us? (0.o)
  [{:as app :keys [datomic remote]} {:as event-msg :keys [id uid send-fn]}]
  (log/info "Sending bootstrap message")
  (protocols/send-event! remote uid [:dat.sync.client/bootstrap (protocols/bootstrap datomic)]))

;; Fallback handler; should send message saying I don't know what you mean
(defmethod event-msg-handler :default ; Fallback
  [app {:as event-msg :keys [event id ?data ring-req ?reply-fn send-fn]}]
  (log/warn "Unhandled event:" id))

;; ;; ## Works with unified dat.sync.core
;; (defmulti server-handler (fn [app {:as segment :keys [id]}] id))

;; (defmethod server-handler :dat.sync.client/bootstrap
;;   [{:keys [remote datomic]} {:as seg :keys [uid]}]
;;   (protocols/send-event! remote uid [:dat.sync.client/bootstrap (protocols/bootstrap datomic)]))

;; (defmethod server-handler :dat.sync.remote/tx
;;   [{:keys [world]} {:as seg :keys [?data]}]
;;   (async/put! (:in world) {:datoms ?data}))

;; (defmethod server-handler :default
;;   [{:keys []} seg]
;; ;;   (log/warn "Unhandled event:" id)
;;   )

;; (defmethod server-handler :chsk/ws-ping
;;   [_ _]
;;   (log/debug "Ping")
;;   )

;; ## Transaction report handler

;; TODO XXX write me to remove any :db/fn values
(declare filter-tx-deltas)
(def filter-tx-deltas identity)

(defn handle-transaction-report!
  [remote tx-deltas]
  ;; This handler is where you would eventually set up subscriptions
  (try
    (let [tx-deltas (filter-tx-deltas tx-deltas)]
      (protocols/send-event! remote [:dat.sync.client/recv-remote-tx tx-deltas]))
    (catch Exception e
      (log/error "Failed to send transaction report to clients!")
      (.printStackTrace e))))

;; ## The actual app component, which starts sente's chsk router and hooks up the msg handler

(defrecord App [config datomic remote sente-stop-fn]
  component/Lifecycle
  (start [component]
    (log/info "Starting websocket router and transaction listener")
    (let [sente-stop-fn (sente/start-chsk-router!
                          (:ch-recv remote)
                          ;(fn [event] (log/info "Just got event:" (with-out-str (clojure.pprint/pprint))))
                          ;; There sould be a way of specifying app-wide middleware here
                          (partial event-msg-handler component))]
      ;; Start our transaction listener
      (go-loop []
        (handle-transaction-report! remote (async/<!! (:tx-report-chan datomic)))
        (recur))
      (assoc component :sente-stop-fn sente-stop-fn)))
  (stop [component]
    (log/debug "Stopping websocket router")
    (sente-stop-fn)
    component))

(defn new-app []
  (map->App {}))




;; ## Debugging

;; You can leave, commented out, some code which grabs the active system and runs some quick checks for the
;; scope in which you
(comment
  (require 'user)
  (let [remote (:remote user/system)]
    (send-tx!)))



