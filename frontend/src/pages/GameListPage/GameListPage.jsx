import { useState, useEffect } from "react";
import { Link } from "react-router";
import * as gameService from '../../services/gameService';

export default function GameListPage(props) {
 const [games, setGames] = useState([]);

 useEffect(() => {
  async function fetchGames() {
   const games = await gameService.index();
   setGames(games);
  }
  fetchGames();
 }, []);

 return (
  <div>
   <h1>Game List Page</h1>
   {games.length ?
     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}> {/* Centering the entire grid of game cards */}
     {games.map((game) =>
     <Link key={game._id} to={`/games/${game._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={{
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        width: '200px',
        display: 'flex',         
        flexDirection: 'column',  
        alignItems: 'center' 
      }}>
       <header style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2>{game.title}</h2>
       </header>
       {game.coverImage && (
         <img
          src={game.coverImage}
          alt={`Cover for ${game.title}`}
          style={{ width: '100%', height: 'auto', objectFit: 'cover', maxWidth: '180px' }} 
         />
        )}
      </article>
     </Link>)}
     </div>
    :
    <p>No Games Yet</p>
   }
  </div>
 );
}
