import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar-container">
      <ul>
        <div className="sidebar-item">
          <Link to="/client/home">
            <li>Home</li>
          </Link>
        </div>

        <div className="sidebar-item">
          <Link to="/client/wing-t">
            <li>Wing-T</li>
          </Link>
        </div>

        <div className="sidebar-item">
          <Link to="/client/run-and-shoot">
            <li>Run and Shoot</li>
          </Link>
        </div>

        <div className="sidebar-item">
          <Link to="/client/air-raid">
            <li>Air Raid</li>
          </Link>
        </div>

        <div className="sidebar-item">
          <Link to="/client/widezone">
            <li>Widezone</li>
          </Link>
        </div>

        <div className="sidebar-item">
          <Link to="/client/west-coast">
            <li>West Coast</li>
          </Link>
        </div>
      </ul>

      
    </div>
  );
}

export default Sidebar;
