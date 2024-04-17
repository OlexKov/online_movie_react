import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import { About } from './components/About/About';
import { NotFound } from './components/NotFound/NotFound';


function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
           <Route index element={<Home />} />
           <Route path="about" element={<About />} />
           <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
  );
}

export default App;
