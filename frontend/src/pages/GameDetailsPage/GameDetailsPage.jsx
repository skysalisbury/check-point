import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import * as gameService from '../../services/gameService';

export default function GameDetailsPage(props) {
  const [game, setGame] = useState(null);
  const params = useParams();
  const { gameId } = params;

  // const handleAddComment = async (commentFormData) => {
  //   const newComment = await hootService.createComment(gameId, commentFormData);
  //   setGame({ ...game, comments: [...game.comments, newComment] });
  // };

//   const handleDeleteComment = async (commentId) => {
//   try {
//     await hootService.deleteComment(gameId, commentId);
//     setGame({
//       ...game,
//       comments: game.comments.filter((comment) => comment._id !== commentId),
//     });
//   } catch (err) {
//     console.error('Error deleting comment:', err);
//   }
// };


  useEffect(() => {
    async function fetchGame() {
      const gameData = await gameService.show(gameId);
      setGame(gameData);
    }
    fetchGame();
  }, [gameId]);
  console.log('game state:', game);

  if (!game) return <main>Loading...</main>;
   return (
    <div style={{ padding: '1rem' }}>
      <h1>{game.title}</h1>
      <img
        src={game.coverImage}
        alt={game.title}
        style={{ width: '300px', borderRadius: '12px' }}
      />
      <p><strong>Genres:</strong> {game.genres?.join(', ') || 'N/A'}</p>
      <p><strong>Platforms:</strong> {game.platforms?.join(', ') || 'N/A'}</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Reviews</h2>
        <p>(You’ll render reviews here later)</p>
      </section>
    </div>
  );
}
