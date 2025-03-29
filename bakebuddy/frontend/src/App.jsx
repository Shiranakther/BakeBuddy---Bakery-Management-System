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
import UpdateIngredientQuantity from './pages/AddIngrediantQuntity'
import ShowIngrediant from './pages/ShowIngrediant';

import CreateIngrediant from './pages/CreateIngrediant';
import Layout from '../components/Layout';

import AllReports from './pages/AllReports';
import ProductionReport from './pages/ProductionReport';
import Unauthorized from '../components/Unauthorized';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfileUser from './pages/ProfileUser';
import EditProfile from './pages/EditProfile';
import IngredientReport from './pages/IngredientReport';
import UpdateIngredient from './pages/UpdateIngrediant';
import PrivateRoute from '../components/PrivateRoute';
import SlowMovingReport from './pages/SlowMovingReport'

function App() {

  return <BrowserRouter>
  
    <Routes>
    <Route path="/register" element={<Register/>} />
    <Route path="/login" element={<Login />} />

    <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
        <Route path='/create-sales' element={<SalesCreate/>}/>
        <Route path="/create-sales/update/:id" element={<SalesUpdate/>}/>
        <Route path="/create-sales/repot" element={<ReportSales/>}/>  
      
        <Route path='/production' element ={<Production/>}/>
        <Route path='/smartbake/:id' element ={<Smartbake/>}/>
        <Route path='/items' element ={<Items/>}/>
        <Route path='/add-item' element={<PrivateRoute allowedRoles={['admin']}><AddItem/></PrivateRoute>}/>
        <Route path="/update-item/:itemId" element={<PrivateRoute allowedRoles={['admin']}><UpdateItem/></PrivateRoute>}/> {/* Ensure this is exact */}

        <Route path="/show-ingredient" element={<ShowIngrediant/>}/>  
        <Route path="/create-ingrediant" element={<PrivateRoute allowedRoles={['admin']}><CreateIngrediant/></PrivateRoute>}/> 
        <Route path="/update-ingredient-quantity" element={<PrivateRoute allowedRoles={['admin']}><UpdateIngredientQuantity/></PrivateRoute>}/> 
        <Route path="/show-ingredient-report" element={<IngredientReport/>}/>
        <Route path="/update-ingredient/:id"element={<PrivateRoute allowedRoles={['admin']}><UpdateIngredient/></PrivateRoute>}/>

        <Route path="/all-reports" element={<AllReports/>}/> 
        <Route path="/production-report" element={<ProductionReport/>}/>
        <Route path='/slow-moving-report' element={<SlowMovingReport/>}/>


        <Route path="h" element={<Header/>} />
        <Route path="lay" element={<Layout/>} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/profile" element={<ProfileUser/>} />
        <Route path="/edit-profile" element={<EditProfile />} />

        

    </Route>
    </Routes>
   
    </BrowserRouter>
}

export default App






