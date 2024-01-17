import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Craftwiki from './pages/Craftwiki';
import Createwiki from './data/wikis/Createwiki';
import Editwiki from './data/wikis/Editwiki';
import Createcategory from './data/categories/Createcat';
import EditCategory from './data/categories/EditCategory';
import Header from './layout/Header';

function App() {
  return (
      <BrowserRouter>
    <Routes>
      <Route path='/' Component={Home}/>
      <Route path='/' Component={Header}/>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={Register}/>
      <Route path='/dashboard' Component={Dashboard}/>
      <Route path='/craftwiki' Component={Craftwiki}/>
      <Route path='/createWiki' Component={Createwiki}/>
      <Route path='/createcategory' Component={Createcategory}/>
      <Route path='/edit/:id' Component={Editwiki}/>
      <Route path='/editcategory/:id' Component={EditCategory}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
