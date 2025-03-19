import '../css/App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import SalesCreate from './pages/SalesCreate';
import Home from './pages/Home'


function App() {


  return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/create-sales' element={<SalesCreate/>}/>
    </Routes>
    </BrowserRouter>
}

export default App
