'use client';
import Image from 'next/image';
import { Box, Typography, Container, Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const About = () => {
  return (
    <Container maxWidth="xl" style={{ paddingTop: '4rem'}}>
      {/* Hero Image */}
      <Grid container justifyContent="center" className="my-4">
        <Grid item xs={12}>
          <Box className="d-flex justify-content-center m-3">
            <Image
              src="/mainwalpaper.jpg"
              alt="main wallpaper"
              className="rounded"
              width={1920}
              height={300}
              style={{ width: '100%', height: '17rem', objectFit: 'cover' }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Section 1 */}
      <Grid container spacing={4} alignItems="center" className="my-5 flex-column flex-md-row">
        <Grid item xs={12} md={6} className="text-center mb-4 mb-md-0">
          <Image
            src="/farmjpg2.avif"
            alt="farm"
            className="rounded"
            width={500}
            height={300}
            style={{ maxWidth: '70%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" className='pb-3'>A Taste of Pure Goodness</Typography>
          <Typography paragraph className='pb-5'>
            At <b>GHARAYA</b>, we bring you the finest produce, fresh from the farm to your table.
            Our commitment to quality means that every bite is bursting with natural flavor, grown
            with care by local farmers who take pride in what they do. Whether it's crisp vegetables,
            juicy fruits, or farm-fresh eggs, you can trust that every item we deliver is handpicked
            at the peak of freshness, ensuring you get nothing but the best.
          </Typography>
        </Grid>
      </Grid>

      {/* Why Gharaya */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" >Why Gharaya?</Typography>
      </Box>

      {/* Icons Section */}
      <Box sx={{ backgroundColor: '#e0f7fa', py: 5 }}>
      <Grid container spacing={4} justifyContent="center" className="text-center px-4 py-3">
        {[
          { icon: 'heart', title: 'A Taste of Pure Goodness' },
          { icon: 'arrow-repeat', title: 'Discover Endless Options' },
          { icon: 'p-circle-fill', title: 'Premium Quality Vegetables' },
          { icon: 'map', title: 'Origin Tracking' },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} className="p-4">
            <Typography variant="h4" className="text-success" sx={{ mb: 2 }}>
              <i className={`bi bi-${item.icon}`} style={{ fontSize: '40px' }}></i>
            </Typography>
            <Typography fontWeight="bold" sx={{ mt: 1 }}>
              {item.title}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>



      {/* Section 2 */}
      <Grid container spacing={4} alignItems="center" className="my-5">
        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
          <Typography variant="h4"  className='pb-3'>Discover Endless Options</Typography>
          <Typography paragraph className='pb-5'>
            At <b>GHARAYA</b>, we offer endless options to ensure you find exactly what you need
            whether it is for your home, restaurant, or personal. With our diverse range of vegetables,
            the possibilities are limitless.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} textAlign="center" order={{ xs: 1, md: 2 }}>
          <Image
            src="/imageproject1.jpg"
            alt="Discover"
            className="rounded"
            width={500}
            height={300}
            style={{ maxWidth: '70%', height: 'auto' }}
          />
        </Grid>
      </Grid>

      {/* Section 3 */}
      <Grid container spacing={4} alignItems="center" className="my-5">
        <Grid item xs={12} md={6} textAlign="center">
          <Image
            src="/premiumquality1.jpg"
            alt="Premium"
            className="rounded"
            width={500}
            height={300}
            style={{ maxWidth: '70%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" className='pb-3'>Premium Quality Vegetables</Typography>
          <Typography paragraph className='pb-5'>
            At <b>GHARAYA</b>, we are committed to bringing you premium quality vegetables that stand
            out in freshness, taste, and nutritional value. Grown in the best conditions, our vegetables
            are carefully selected, ensuring that only the finest produce reaches your table.
          </Typography>
        </Grid>
      </Grid>

      {/* Section 4 */}
      <Grid container spacing={4} alignItems="center" className="my-5">
        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
          <Typography variant="h4" className='pb-3'>Origin Tracking</Typography>
          <Typography paragraph className='pb-5'>
            At <b>GHARAYA</b>, we believe in complete transparency and the importance of knowing where
            your food comes from. With our origin tracking system, you can trace the journey of every
            vegetable from the moment it's harvested to when it reaches your table.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} textAlign="center" order={{ xs: 1, md: 2 }}>
          <Image
            src="/origin.jpg"
            alt="Origin"
            className="rounded"
            width={500}
            height={300}
            style={{ maxWidth: '70%', height: 'auto' }}
          />
        </Grid>
      </Grid>

      {/* Final Section */}
      <Grid container spacing={4} alignItems="center" className="my-5">
        <Grid item xs={12} md={6} textAlign="center">
          <Image
            src="/lastimage.jpg"
            alt="GHARAYA"
            className="rounded"
            width={500}
            height={300}
            style={{ maxWidth: '70%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" className='pb-3'>GHARAYA.COM</Typography>
          <Typography paragraph className='pb-5'>
            Connecting 10K+ farmer families with 3.1L+ happy families in Jabalpur. We've also gone
            offline with our farm stores in Jabalpur SabjiMandi. Our farm-to-fork concept ensures you
            receive pure, fresh, hygienic, and top-quality produce, packed with essential nutrients for
            optimal health.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
