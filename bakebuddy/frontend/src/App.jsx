import '../css/App.css'
import { BrowserRouter,Routes,Route, Router } from 'react-router-dom';
import SalesCreate from './pages/SalesCreate';
import Home from './pages/Home'
import Production from './pages/Production';
import Smartbake from './pages/Smartbake';

import Items from './pages/Items';
import AddItem from './pages/AddItems';
import SalesUpdate from './pages/SalesUpdate';
import UpdateItem from './pages/UpdateItem';
import ReportSales from './pages/ReportSales';
import Header from '../components/Header';

import ShowIngrediant from './pages/ShowIngrediant';

import CreateIngrediant from './pages/CreateIngrediant';
import Layout from '../components/Layout';



function App() {

  return <BrowserRouter>
  
    <Routes>
    <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
        <Route path='/create-sales' element={<SalesCreate/>}/>
        <Route path="/create-sales/update/:id" element={<SalesUpdate/>}/>
        <Route path="/create-sales/repot" element={<ReportSales/>}/>  
      
        <Route path='/production' element ={<Production/>}/>
        <Route path='/smartbake/:id' element ={<Smartbake/>}/>
        <Route path='/items' element ={<Items/>}/>
        <Route path='/add-item' element ={<AddItem/>}/>
        <Route path="/update-item/:itemId" element={<UpdateItem />} /> {/* Ensure this is exact */}
        <Route path="/show-ingredient" element={<ShowIngrediant/>}/>  
        <Route path="/create-ingrediant" element={<CreateIngrediant/>}/> 

        <Route path="h" element={<Header/>} />
        <Route path="lay" element={<Layout/>} />

    </Route>
    </Routes>
   
    </BrowserRouter>
}

export default App





