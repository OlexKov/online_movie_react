import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import { About } from './components/About/About';
import { NotFound } from './components/NotFound/NotFound';
import { Registration } from './components/Registration/Registration';
import { Login } from './components/Login/Login';
import { Account } from './components/Account/Account';
import { Favourite } from './components/Favourite/Favourite';


function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
           <Route index element={<Home />} />
           <Route path="about" element={<About />} />
           <Route path="registration" element={<Registration />} />
           <Route path="login" element={<Login />} />
           <Route path="account" element={<Account />} />
           <Route path="favourite" element={<Favourite />} />
           <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
  );
}

export default App;
