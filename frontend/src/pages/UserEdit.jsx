import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Meta from '../components/Meta';
import { useGetUserByIdQuery, useUpdateUserByIdMutation } from '../services/userApi';

const UserEdit = () => {
	const { userId } = useParams();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState(null);

	const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(userId);
	const user = userData?.userDetails;

	const [updateUserById, { isLoading: updateUserLoading, error }] = useUpdateUserByIdMutation();

	const updateUserHandler = async () => {
		try {
			const res = await updateUserById({ _id: userId, name: name, email: email, password: password, role: role }).unwrap();

			if (res.success) {
				toast.success('User Updated Successfully.');
			} else {
				toast.error(error.message || 'Something Went Wrong.');
			}
		} catch (err) {
			toast.error(err?.data?.message || 'Something Went Wrong.');
		}
	};

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setPassword(user.password);
			setRole(user.role);
		}
	}, [user]);

	return (
		<>
            <Meta title="Edit User | SHOP" description="Edit User Page of The SHOP For Admin." />
			<Box component="main" marginY={{ xs: 4, lg: 14 }} minHeight="75vh">
				<Container maxWidth="3xl">
					<Box marginBottom={4} width={{ xs: '100%', lg: '50%' }} marginX="auto">
						<Link component={RouterLink} to="/admin/users">
							<Button variant="contained" size="large" startIcon={<ArrowBackIcon />}>
								Go Back
							</Button>
						</Link>
					</Box>
					<Paper variant="outlined" sx={{ width: { xs: '100%', lg: '50%' }, marginX: 'auto' }}>
						<Stack spacing={6} padding={{ xs: 4, lg: 8 }}>
							<Typography color="primary" variant="h3" component="h3" align="center" fontWeight={700} width="100%">
								Edit User
							</Typography>
							<TextField
								fullWidth={true}
								required={true}
								id="name"
								label="Name"
								variant="outlined"
								margin="normal"
								type="text"
								value={name || ''}
								onChange={(e) => setName(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="email"
								label="E-Mail"
								variant="outlined"
								margin="normal"
								type="email"
								value={email || ''}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<TextField
								fullWidth={true}
								required={true}
								id="password"
								label="Password"
								variant="outlined"
								margin="normal"
								type="password"
								value={password || ''}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<FormControl>
								<FormLabel id="user-group-label">Select A Role</FormLabel>
								<RadioGroup aria-labelledby="user-group-label" value={role} onChange={(e) => setRole(e.target.value)} name="user-group">
									<FormControlLabel value={0} control={<Radio size="medium" />} label="USER" />
									<FormControlLabel value={1} control={<Radio size="medium" />} label="ADMIN" />
								</RadioGroup>
							</FormControl>
							{userLoading || updateUserLoading ? (
								<CircularProgress color="secondary" thickness={4} size="4rem" />
							) : (
								<Button variant="contained" size="large" onClick={updateUserHandler} sx={{ width: '100%', paddingY: 1.5 }}>
									Update User
								</Button>
							)}
						</Stack>
					</Paper>
				</Container>
			</Box>
		</>
	);
};

export default UserEdit;