import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { HomePage } from "./pages/home";
import Styles from "@/styles/nav.module.scss";
import clsx from "clsx";
import { CreatePage } from "./pages/create";
import { UpdatePage } from "./pages/update";

function App() {
  return (
    <Router>
      <nav className={Styles.nav}>
        <div className={Styles.content}>
          <NavLink
            className={({ isActive }) =>
              clsx(Styles.link, isActive && Styles.activeLink)
            }
            to={"/"}
          >
            Задачи
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              clsx(Styles.link, isActive && Styles.activeLink)
            }
            to={"/create"}
          >
            create
          </NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/update/:id" element={<UpdatePage />} />
        <Route path="*" element={<>404</>} />
      </Routes>
    </Router>
  );
}

export default App;
