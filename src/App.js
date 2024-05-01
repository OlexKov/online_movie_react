import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import { About } from './components/About/About';
import { Registration } from './components/Registration/Registration';
import { Login } from './components/Login/Login';
import { Account } from './components/Account/Account';
import { Favourite } from './components/Favourite/Favourite';
import { MovieTable } from './components/MovieTable/MovieTable';
import { StafTable } from './components/StafTable/StafTable';
import { CreateEditStaf } from './components/CreateEditStaf/CreateEditStaf';
import Error from './components/Error/Error';
import { CreateEditMovie } from './components/CreateEditMovie/CreateEditMovie';
import FogotPassword from './components/FogotPassword/FogotPassword';

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
        <Route path="movietable" element={<MovieTable />} />
        <Route path="staftable" element={<StafTable />} />
        <Route path="fogotpassword" element={<FogotPassword />} />
        <Route path="create-edit-staf/:id" element={<CreateEditStaf />} />
        <Route path="create-edit-movie/:id" element={<CreateEditMovie/>} />
        <Route path="error/:status/:title/:subTitle/:location" element={<Error />} />
        {/* <Route path="*" element={
          <Error
            status="404"
            title="404"
            subTitle="Вибачте, сторінкт на яку ви намагаєтесь перейти не існує."
          />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
