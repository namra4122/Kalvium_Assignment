import React, { useEffect, useState } from 'react';
import { ChakraProvider, Button, Stack } from '@chakra-ui/react';
import { PDFViewer } from './components/PDFViewer';
import { io } from 'socket.io-client';
import { defaultSystem } from "@chakra-ui/react"


const socket = io('http://localhost:4122');

interface PageUpdateData {
  type: string;
  page: number;
}

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    socket.send(JSON.stringify({ type: 'getPage' }));
    
    socket.on('pageUpdate', (data: PageUpdateData) => setPage(data.page));

    return () => {
      socket.off('pageUpdate');
    };
  }, []);

  const handleNextPage = () => {
    if (isAdmin) {
      const newPage = page + 1;
      setPage(newPage);
      socket.send(JSON.stringify({ type: 'setPage', page: newPage }));
    }
  };

  const handlePrevPage = () => {
    if (isAdmin && page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      socket.send(JSON.stringify({ type: 'setPage', page: newPage }));
    }
  };

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
    socket.send(JSON.stringify({ type: 'setAdmin' }));
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <Stack direction="column" align="center">
        <PDFViewer page={page} />
        <Button colorScheme="teal" onClick={handlePrevPage} disabled={!isAdmin || page === 1}>
          Previous
        </Button>
        <Button colorScheme="teal" onClick={handleNextPage} disabled={!isAdmin}>
          Next
        </Button>
        <Button colorScheme="purple" onClick={handleAdminToggle}>
          {isAdmin ? 'Switch to Viewer' : 'Switch to Admin'}
        </Button>
      </Stack>
    </ChakraProvider>
  );
};

export default App;
