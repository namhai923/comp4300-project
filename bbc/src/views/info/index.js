import ProductCategories from './ProductCategories';
import AppFooter from './AppFooter';
import ProductHero from './ProductHero';
import ProductValues from './ProductValues';
import ProductHowItWorks from './ProductHowItWorks';
import InfoAppBar from './InfoAppBar';

const InfoPage = () => (
    <>
        <InfoAppBar />
        <ProductHero />
        <ProductValues />
        <ProductCategories />
        <ProductHowItWorks />
        <AppFooter />
    </>
);

export default InfoPage;
