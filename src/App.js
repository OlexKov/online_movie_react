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
import { PasswordReset } from './components/PasswordReset/PasswordReset';
import { ConfigProvider, theme } from 'antd';
import { useSelector } from 'react-redux';
import { Movie } from './components/Movie/Movie';
import { AuthProtectedRoute } from './components/ProtectedRoutes/AuthProtectedRoute';
import { UserProtectedRoute } from './components/ProtectedRoutes/UserProtectedRoute';
import { AdminProtectedRoute } from './components/ProtectedRoutes/AdminProtectedRoute';
import { Staf } from './components/Staf/Staf';
import { AdminFeedbacks } from './components/AdminFeedbacks/AdminFeedbacks';
import { BuyPremium } from './components/BuyPremium/BuyPremium';


function App() {
  const darkTheme = useSelector(store => store.user.userTheme)
  const user = useSelector(state => state.user.data)

  return (
    <ConfigProvider theme={{ algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="/free" element={<Home />} />
          <Route path="registration" element={<Registration />} />
          <Route path="login" element={<Login />} />
          <Route path="account" element={
            <AuthProtectedRoute user={user} children={<Account />}/>
          } />
          <Route path="premium" element={
            <UserProtectedRoute user={user} children={<BuyPremium />}/>
          } />
          <Route path="favourite" element={
            <UserProtectedRoute user={user} children={ <Favourite />}/>
          } />
          <Route path="movietable" element={
            <AdminProtectedRoute user={user} children={<MovieTable/>}/>
          } />
          <Route path="staftable" element={
            <AdminProtectedRoute user={user} children={ <StafTable />}/>
          } />
          <Route path="feedbacks" element={
            <AdminProtectedRoute user={user} children={ <AdminFeedbacks />}/>
          } />
          <Route path="movie/:id" element={<Movie />} />
          <Route path="staf/:stafId" element={<Staf />} />
          <Route path="fogotpassword" element={<FogotPassword />} />
          <Route path={process.env.REACT_APP_PASSWORD_RESET_PAGE} element={<PasswordReset />} />
          <Route path="create-edit-staf/:id" element={
            <AdminProtectedRoute user={user} children={ <CreateEditStaf />}/>
          } />
          <Route path="create-edit-movie/:id" element={
            <AdminProtectedRoute user={user} children={<CreateEditMovie />}/>
          } />
          <Route path="error" element={<Error />} />
          <Route path="*" element={
            <Error
              status="404"
              title="404"
              subTitle="Вибачте, сторінкт на яку ви намагаєтесь перейти не існує."
            />} />
            <Route path="forbiden" element={
            <Error
              status="403"
              title="403"
              subTitle="В доступі відмовлено.Ви не маєте дозволу для доступу до цієї сторінки."
            />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
