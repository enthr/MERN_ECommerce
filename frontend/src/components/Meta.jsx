import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
		</Helmet>
	);
};

Meta.defaultProps = {
    title: 'Welcome To The SHOP',
    description: 'We Sell The Best Product Cooked By Mr. Walter White'
};

export default Meta;