import '../css/App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import SalesCreate from './pages/SalesCreate';
import Home from './pages/Home';
import SalesUpdate from './pages/SalesUpdate';


function App() {
  
  return <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>}/>
        <Route path='/create-sales' element={<SalesCreate/>}/>
        <Route path='/create-sales/update/:id' element={<SalesUpdate/>}/>
    </Routes>
    </BrowserRouter>
}

export default App
