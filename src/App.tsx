 /* eslint-disable */

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import { ArtworkItem } from './components/ArtworkItem/ArtworkItem';
import { NewArtworkForm, ArtworkMeta } from './components/NewArtworkForm/NewArtworkForm';
import { TopBar } from './components/TopBar/TopBar';

export const App = () => {
  const [artworks, setArtworks] = useState<ArtworkMeta[]>([
    { id: 27992, disabled: false },
    { id: 27998, disabled: false },
    { id: 27999, disabled: false },
    { id: 27997, disabled: true },
    { id: 27993, disabled: false },
  ]);

  const handleAddArtwork = (id: number) => {
    setArtworks([...artworks, { id, disabled: false }])
  }

  return (
    <Box className="App" >
      <TopBar />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        columnGap: '8px',
        rowGap: '16px',
        width: '70vw',
        marginLeft: '15vw',
        marginTop: '16px',
        padding: '16px',
        height: 'calc(100vh - 193px)',
        overflow: 'auto'
      }}>
          {artworks.map((art: any) => <ArtworkItem key={art.id} id={art.id} disabled={art.disabled} />)}
      </Box>
      <NewArtworkForm handleAddArtwork={handleAddArtwork} artworks={artworks} />
    </Box>
  );
}
