import style from '../navbar/navbar.module.scss';
import logo from '../../assets/logo.svg';
import magnifierIcon from '../../assets/magnifier.svg';

export const Navbar = () => {
  return ( 
    <header>
      <div className={style.logo}>
        <img src={logo} alt="logo" />
      </div>
      <div className={style.searchInput}>
        <label htmlFor="search">
          <img src={magnifierIcon} alt="Magnifier icon" />
        </label>
        <input type="text" id={style.search} placeholder="Search in Collections, Items, Creators" />
      </div>
      <nav>
        <ul>
          <li><a href="/">Discover</a></li>
          <li><a href="/">Activity</a></li>
          <li><a href="/">Resources</a></li>
        </ul>
      </nav>
      <button className={style.btnCreate}>Create</button>
      <button className={style.btnWallet}>Wallet</button>
    </header>
  )
}