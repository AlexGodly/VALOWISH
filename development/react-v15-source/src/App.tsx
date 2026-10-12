import{useEffect}from'react';
import{AnimatePresence,motion}from'motion/react';
import{Shell}from'./components/Shell';
import{ItemDetails}from'./components/ItemDetails';
import{CommandCenter}from'./pages/CommandCenter';
import{Discover}from'./pages/Discover';
import{Collection}from'./pages/Collection';
import{Planner,Insights,Loadouts,Activity}from'./pages/Operations';
import{Settings}from'./pages/Settings';
import{useCloud}from'./lib/useCloud';
import{useApp}from'./lib/store';
export default function App(){
 const page=useApp(s=>s.page),toast=useApp(s=>s.toast),notify=useApp(s=>s.notify),reducedMotion=useApp(s=>s.data.preferences.reducedMotion);
 const cloud=useCloud();
 useEffect(()=>{document.documentElement.classList.toggle('reduce-motion',reducedMotion)},[reducedMotion]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>notify(''),3000);return()=>clearTimeout(timer)},[toast,notify]);
 return <><Shell>{page==='home'?<CommandCenter/>:page==='discover'?<Discover/>:page==='wishlist'?<Collection mode="wishlist"/>:page==='locker'?<Collection mode="locker"/>:page==='priority'?<Collection mode="priority"/>:page==='loadouts'?<Loadouts/>:page==='planner'?<Planner/>:page==='insights'?<Insights/>:page==='history'?<Activity/>:<Settings cloud={cloud}/>}</Shell><ItemDetails/>
 <AnimatePresence>{toast&&<motion.div className="toast" role="status" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} exit={{opacity:0,y:15}}>{toast}</motion.div>}</AnimatePresence></>
}
