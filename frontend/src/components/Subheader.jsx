import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';

const Subheader = () => {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState('');

	const searchHandler = (e) => {
		e.preventDefault();
		navigate(`/search/${keyword.trim()}`);
	};

	return (
		<Box marginTop={8}>
			<Container maxWidth="3xl">
				<Box width={{ xs: '100%', lg: '80%' }} marginX="auto">
					<Stack direction="row" spacing={2}>
						<TextField
							fullWidth={true}
							required={true}
							id="search"
							label="Search Products"
							variant="standard"
							margin="normal"
							type="text"
							color="primary"
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							sx={{ width: '70%' }}
						/>
						<Button variant="contained" startIcon={<SearchIcon />} size="large" color="primary" onClick={searchHandler} sx={{ width: '30%' }}>
							Search
						</Button>
					</Stack>
				</Box>
			</Container>
		</Box>
	);
};

export default Subheader;