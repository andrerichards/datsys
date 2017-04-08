(ns user
  (:require
    [clojure.java.javadoc :refer [javadoc]]
    [clojure.pprint :refer [pprint]]
    [clojure.reflect :refer [reflect]]
    [clojure.repl :refer [apropos dir doc find-doc pst source]]
    [com.stuartsierra.component :as component]
    [clojure.tools.namespace.repl :refer [refresh refresh-all]]
    [dat.sys.system :as system]
    [taoensso.timbre :as log :include-macros true]
    [dat.sys.figwheel-server :as fserver]))

(def system nil)

(defn init
  ([config-overrides]
   (alter-var-root #'system (fn [_] (assoc (system/create-system config-overrides)
                                      :http-server (component/using (fserver/new-figwheel-server) [:datomic :config :ring-handler])))))
  ([] (init {})))

(defn start []
  (alter-var-root #'system component/start))

(defn stop []
  (alter-var-root #'system
    (fn [s] (when s (component/stop s)))))

(defn run
  ([config-overrides]
   (init config-overrides)
   (start))
  ([] (run {})))

(defn reset
  ;; XXX Hmm... not sure how to get config-overrides with reset because of refresh :after needing a 0-arity fn
  []
  (stop)
  (refresh :after 'user/run))

(defn browser-repl []
  (if system
    (fserver/browser-repl (:http-server system))
    (log/error "The system must be running to open a browser-repl. Use (run) first.")))

(comment
  ;; Run a customized system XXX
  (try
    (run {:datomic {:seed-data "config/local/seed-data.edn"}})
    (catch Exception e (.printStackTrace e)))
  (stop)
  (reset))


;; You can use this to add dependencies without rebooting your repl.
;; Perhaps wrap into a helpful function which takes the lib name and version (ideally just optionally; newest would
;; default) and installs that attribute using the code below.
;; TODO XXX
(comment
  (use '[cemerick.pomegranate :only (add-dependencies)])
  (add-dependencies :coordinates '[[slingshot "0.12.2"]]
                       :repositories (merge cemerick.pomegranate.aether/maven-central
                                            {"clojars" "http://clojars.org/repo"})))

