import { Helmet } from 'react-helmet-async';

interface SeoProps {
	title: string;
	description: string;
	canonical?: string;
	image?: string;
	schemaMarkup?: Record<string, any>;
	noIndex?: boolean;
}

const Seo: React.FC<SeoProps> = ({
	title,
	description,
	canonical,
	image = '/og-image.jpg',
	schemaMarkup,
	noIndex = false,
}) => {
	const siteUrl = import.meta.env.VITE_SITE_URL || 'https://coach-app.com';
	const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
	const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

	return (
		<Helmet>
			{title && <title>{title}</title>}

			<meta name='description' content={description} />
			{noIndex && <meta name='robots' content='noindex, nofollow' />}

			{canonical && <link rel='canonical' href={fullUrl} />}
			<meta property='og:type' content='website' />
			<meta property='og:url' content={fullUrl} />
			{title && (
				<meta property='og:title' content={`${title} | Coach App`} />
			)}
			<meta property='og:description' content={description} />
			<meta property='og:image' content={fullImage} />
			<meta property='og:locale' content='ru_RU' />

			<meta name='twitter:card' content='summary_large_image' />
			{canonical && <meta name='twitter:url' content={fullUrl} />}
			{title && (
				<meta name='twitter:title' content={`${title} | Coach App`} />
			)}
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={fullImage} />

			{schemaMarkup && (
				<script type='application/ld+json'>
					{JSON.stringify(schemaMarkup)}
				</script>
			)}
		</Helmet>
	);
};

export default Seo;
