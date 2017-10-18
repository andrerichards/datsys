// Compiled by ClojureScript 1.9.542 {}
goog.provide('onyx_local_rt.api');
goog.require('cljs.core');
goog.require('com.stuartsierra.dependency');
goog.require('onyx_local_rt.impl');
goog.require('onyx.spec');
/**
 * Takes an Onyx job and returns a new runtime instance.
 */
onyx_local_rt.api.init = (function onyx_local_rt$api$init(p__63535){
var map__63538 = p__63535;
var map__63538__$1 = ((((!((map__63538 == null)))?((((map__63538.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__63538.cljs$core$ISeq$)))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__63538):map__63538);
var job = map__63538__$1;
var workflow = cljs.core.get.call(null,map__63538__$1,new cljs.core.Keyword(null,"workflow","workflow",-640694607));
var graph = onyx_local_rt.impl.workflow__GT_sierra_graph.call(null,workflow);
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),onyx_local_rt.impl.init_task_states.call(null,job,graph),new cljs.core.Keyword(null,"sorted-tasks","sorted-tasks",1984680796),com.stuartsierra.dependency.topo_sort.call(null,graph),new cljs.core.Keyword(null,"pending-writes","pending-writes",-275016241),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"next-action","next-action",1541348716),new cljs.core.Keyword("lifecycle","start-task?","lifecycle/start-task?",1478637931)], null);
});
/**
 * Advances the runtime one step in the lifecycle forward for all tasks.
 */
onyx_local_rt.api.tick = (function onyx_local_rt$api$tick(var_args){
var args63540 = [];
var len__62575__auto___63543 = arguments.length;
var i__62576__auto___63544 = (0);
while(true){
if((i__62576__auto___63544 < len__62575__auto___63543)){
args63540.push((arguments[i__62576__auto___63544]));

var G__63545 = (i__62576__auto___63544 + (1));
i__62576__auto___63544 = G__63545;
continue;
} else {
}
break;
}

var G__63542 = args63540.length;
switch (G__63542) {
case 2:
return onyx_local_rt.api.tick.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 1:
return onyx_local_rt.api.tick.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str.cljs$core$IFn$_invoke$arity$1("Invalid arity: "),cljs.core.str.cljs$core$IFn$_invoke$arity$1(args63540.length)].join('')));

}
});

onyx_local_rt.api.tick.cljs$core$IFn$_invoke$arity$2 = (function (env,n){
return cljs.core.nth.call(null,cljs.core.iterate.call(null,onyx_local_rt.api.tick,env),n);
});

onyx_local_rt.api.tick.cljs$core$IFn$_invoke$arity$1 = (function (env){
var this_action = new cljs.core.Keyword(null,"next-action","next-action",1541348716).cljs$core$IFn$_invoke$arity$1(env);
return onyx_local_rt.impl.transition_action_sequence.call(null,onyx_local_rt.impl.transfer_pending_writes.call(null,onyx_local_rt.impl.integrate_task_updates.call(null,env,this_action)),this_action);
});

onyx_local_rt.api.tick.cljs$lang$maxFixedArity = 2;

/**
 * Returns true if there are no in-flight segments.
 */
onyx_local_rt.api.drained_QMARK_ = (function onyx_local_rt$api$drained_QMARK_(env){
var task_states = cljs.core.vals.call(null,new cljs.core.Keyword(null,"tasks","tasks",-1754368880).cljs$core$IFn$_invoke$arity$1(env));
var inboxes = cljs.core.map.call(null,new cljs.core.Keyword(null,"inbox","inbox",1888669443),task_states);
var batches = cljs.core.map.call(null,cljs.core.comp.call(null,new cljs.core.Keyword("onyx.core","batch","onyx.core/batch",-1789886143),new cljs.core.Keyword(null,"event","event",301435442)),task_states);
return (cljs.core.every_QMARK_.call(null,cljs.core.comp.call(null,cljs.core.not,cljs.core.seq),inboxes)) && (cljs.core.every_QMARK_.call(null,cljs.core.nil_QMARK_,batches));
});
/**
 * Calls `tick` until there are no more in-flight segments. Will only
 *   call `tick` 10,000 times, or a user-given number of times, to prevent
 *   an infinite-loop in the case of a problematic job.
 */
onyx_local_rt.api.drain = (function onyx_local_rt$api$drain(var_args){
var args63547 = [];
var len__62575__auto___63550 = arguments.length;
var i__62576__auto___63551 = (0);
while(true){
if((i__62576__auto___63551 < len__62575__auto___63550)){
args63547.push((arguments[i__62576__auto___63551]));

var G__63552 = (i__62576__auto___63551 + (1));
i__62576__auto___63551 = G__63552;
continue;
} else {
}
break;
}

var G__63549 = args63547.length;
switch (G__63549) {
case 1:
return onyx_local_rt.api.drain.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return onyx_local_rt.api.drain.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str.cljs$core$IFn$_invoke$arity$1("Invalid arity: "),cljs.core.str.cljs$core$IFn$_invoke$arity$1(args63547.length)].join('')));

}
});

onyx_local_rt.api.drain.cljs$core$IFn$_invoke$arity$1 = (function (env){
return onyx_local_rt.api.drain.call(null,env,(10000));
});

onyx_local_rt.api.drain.cljs$core$IFn$_invoke$arity$2 = (function (env,max_ticks){
var env__$1 = env;
var i = (0);
while(true){
if((i > max_ticks)){
throw cljs.core.ex_info.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1("Ticked "),cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_ticks),cljs.core.str.cljs$core$IFn$_invoke$arity$1(" times and never drained, runtime will not proceed with further execution.")].join(''),cljs.core.PersistentArrayMap.EMPTY);
} else {
if(cljs.core.truth_(onyx_local_rt.api.drained_QMARK_.call(null,env__$1))){
return env__$1;
} else {
var G__63554 = onyx_local_rt.api.tick.call(null,env__$1);
var G__63555 = (i + (1));
env__$1 = G__63554;
i = G__63555;
continue;

}
}
break;
}
});

onyx_local_rt.api.drain.cljs$lang$maxFixedArity = 2;

/**
 * Returns a subset of the runtime to explain where segments are currently located in the job.
 */
onyx_local_rt.api.env_summary = (function onyx_local_rt$api$env_summary(env){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"next-action","next-action",1541348716),new cljs.core.Keyword(null,"next-action","next-action",1541348716).cljs$core$IFn$_invoke$arity$1(env),new cljs.core.Keyword(null,"tasks","tasks",-1754368880),cljs.core.reduce.call(null,(function (result,task_name){
var tm = cljs.core.get_in.call(null,env,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),task_name,new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("onyx.core","task-map","onyx.core/task-map",1668186921)], null));
var windows = cljs.core.get_in.call(null,env,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),task_name,new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("onyx.core","windows","onyx.core/windows",-1130597258)], null));
var inbox = cljs.core.get_in.call(null,env,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),task_name,new cljs.core.Keyword(null,"inbox","inbox",1888669443)], null));
var G__63557 = result;
var G__63557__$1 = (((cljs.core._EQ_.call(null,new cljs.core.Keyword("onyx","type","onyx/type",1170345418).cljs$core$IFn$_invoke$arity$1(tm),new cljs.core.Keyword(null,"input","input",556931961))) || (cljs.core._EQ_.call(null,new cljs.core.Keyword("onyx","type","onyx/type",1170345418).cljs$core$IFn$_invoke$arity$1(tm),new cljs.core.Keyword(null,"function","function",-2127255473))))?cljs.core.update.call(null,G__63557,task_name,cljs.core.merge,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"inbox","inbox",1888669443),inbox], null)):G__63557);
var G__63557__$2 = ((cljs.core._EQ_.call(null,new cljs.core.Keyword("onyx","type","onyx/type",1170345418).cljs$core$IFn$_invoke$arity$1(tm),new cljs.core.Keyword(null,"output","output",-1105869043)))?cljs.core.update.call(null,G__63557__$1,task_name,cljs.core.merge,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"inbox","inbox",1888669443),inbox,new cljs.core.Keyword(null,"outputs","outputs",-1896513034),cljs.core.get_in.call(null,env,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),task_name,new cljs.core.Keyword(null,"outputs","outputs",-1896513034)], null))], null)):G__63557__$1);
if(!(cljs.core.empty_QMARK_.call(null,windows))){
return cljs.core.update.call(null,G__63557__$2,task_name,cljs.core.merge,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"window-contents","window-contents",1623709161),onyx_local_rt.impl.get_window_contents.call(null,cljs.core.get_in.call(null,env,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),task_name,new cljs.core.Keyword(null,"event","event",301435442)], null)))], null));
} else {
return G__63557__$2;
}
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.keys.call(null,new cljs.core.Keyword(null,"tasks","tasks",-1754368880).cljs$core$IFn$_invoke$arity$1(env)))], null);
});
if(typeof onyx_local_rt.api.transition_env !== 'undefined'){
} else {
/**
 * Data-backed API for transitioning the environment.
 */
onyx_local_rt.api.transition_env = (function (){var method_table__62385__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__62386__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var method_cache__62387__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__62388__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__62389__auto__ = cljs.core.get.call(null,cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),cljs.core.get_global_hierarchy.call(null));
return (new cljs.core.MultiFn(cljs.core.symbol.call(null,"onyx-local-rt.api","transition-env"),((function (method_table__62385__auto__,prefer_table__62386__auto__,method_cache__62387__auto__,cached_hierarchy__62388__auto__,hierarchy__62389__auto__){
return (function (env,action_data){
return new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(action_data);
});})(method_table__62385__auto__,prefer_table__62386__auto__,method_cache__62387__auto__,cached_hierarchy__62388__auto__,hierarchy__62389__auto__))
,new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__62389__auto__,method_table__62385__auto__,prefer_table__62386__auto__,method_cache__62387__auto__,cached_hierarchy__62388__auto__));
})();
}
cljs.core._add_method.call(null,onyx_local_rt.api.transition_env,new cljs.core.Keyword(null,"new-segment","new-segment",-1974816380),(function (env,p__63558){
var map__63559 = p__63558;
var map__63559__$1 = ((((!((map__63559 == null)))?((((map__63559.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__63559.cljs$core$ISeq$)))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__63559):map__63559);
var task = cljs.core.get.call(null,map__63559__$1,new cljs.core.Keyword(null,"task","task",-1476607993));
var segment = cljs.core.get.call(null,map__63559__$1,new cljs.core.Keyword(null,"segment","segment",-964921196));
return cljs.core.update_in.call(null,env,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tasks","tasks",-1754368880),task,new cljs.core.Keyword(null,"inbox","inbox",1888669443)], null),cljs.core.conj,segment);
}));
cljs.core._add_method.call(null,onyx_local_rt.api.transition_env,new cljs.core.Keyword(null,"stop","stop",-2140911342),(function (env,action_data){
var this_action = new cljs.core.Keyword("lifecycle","after-task-stop","lifecycle/after-task-stop",1985614904);
return onyx_local_rt.impl.transition_action_sequence.call(null,onyx_local_rt.impl.integrate_task_updates.call(null,env,this_action),this_action);
}));
/**
 * Given a runtime, places the segment onto
 * the inbox of the specified task. Does not call `tick`
 * or advance the runtime in any way.
 */
onyx_local_rt.api.new_segment = (function onyx_local_rt$api$new_segment(env,input_task,segment){
return onyx_local_rt.api.transition_env.call(null,env,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword(null,"new-segment","new-segment",-1974816380),new cljs.core.Keyword(null,"task","task",-1476607993),input_task,new cljs.core.Keyword(null,"segment","segment",-964921196),segment], null));
});
/**
 * Stops and returns the runtime, simulating the behavior of a
 * distributed peer stopping. It is valid to call `tick` after
 * `stop` to simulate the job starting again.
 */
onyx_local_rt.api.stop = (function onyx_local_rt$api$stop(env){
return onyx_local_rt.api.transition_env.call(null,env,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword(null,"stop","stop",-2140911342)], null));
});

//# sourceMappingURL=api.js.map?rel=1506321311802