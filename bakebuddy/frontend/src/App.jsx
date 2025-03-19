import '../css/App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import SalesCreate from './pages/SalesCreate';
import Home from './pages/Home'
import Production from './pages/Production';
import Smartbake from './pages/Smartbake';
import Items from './pages/Items';


function App() {

  return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/create-sales' element={<SalesCreate/>}/>
        <Route path='/production' element ={<Production/>}/>
        <Route path='/smartbake/:id' element ={<Smartbake/>}/>
        <Route path='/items' element ={<Items/>}/>

    </Routes>
    </BrowserRouter>
}

export default App
