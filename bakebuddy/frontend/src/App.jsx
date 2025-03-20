import '../css/App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import SalesCreate from './pages/SalesCreate';
import Home from './pages/Home'
import Production from './pages/Production';
import Smartbake from './pages/Smartbake';

import Items from './pages/Items';
import AddItem from './pages/AddItems';
import SalesUpdate from './pages/SalesUpdate';
import UpdateItem from './pages/UpdateItem';

import CreateIngredient from './pages/CreateIngredient';
// import ShowIngredient from './pages/ShowIngredient';


function App() {

  return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/create-sales' element={<SalesCreate/>}/>
        <Route path="/create-sales/update/:id" element={<SalesUpdate/>}/> 
        <Route path='/production' element ={<Production/>}/>
        <Route path='/smartbake/:id' element ={<Smartbake/>}/>
        <Route path='/items' element ={<Items/>}/>
        <Route path='/add-item' element ={<AddItem/>}/>
        <Route path="/update-item/:itemId" element={<UpdateItem />} /> {/* Ensure this is exact */}
        <Route path='/create-ingredient' element ={<CreateIngredient/>}/>
        <Route path='/show-ingredient' element ={<AddItem/>}/>
    </Routes>
    </BrowserRouter>
}

export default App
