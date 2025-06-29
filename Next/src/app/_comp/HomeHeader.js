'use client';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSearch } from '../_context/SearchContext';
import Sidecart from '../_comp/Sidecart';

const HomeHeader = () => {
  const { searchQuery, setSearchQuery, categoryFilter, setCategoryFilter } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCategoryChange = (categoryName) => {
    setCategoryFilter(categoryName);
  };

  const categories = ['All', 'Vegetables', 'Leafy', 'Exotic Veg', 'Fruits'];

  return (
    <Container
      fluid
      className="bg-body-tertiary py-2 rounded-bottom shadow position-fixed start-0 end-0 z-3"
      style={{ top: '78px' }}
    >
      <div className="row g-2 align-items-center">
        {/* Search */}
        <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start">
          <Form
            className="d-flex w-100 gap-2 font-monospace"
            onSubmit={handleSubmit}
          >
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="flex-grow-1"
              style={{ maxWidth: '250px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-success" size="sm" type="submit" className="font-monospace">
              Search
            </Button>
          </Form>
        </div>

        {/* Categories + Cart */}
        <div className="col-12 col-md-6 d-flex justify-content-start justify-content-md-end align-items-center flex-nowrap gap-2 font-monospace mt-2 mt-md-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'success' : 'outline-secondary'}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              <i className={`${[category]} me-1`}></i> {category}
            </Button>
          ))}

        </div>
      </div>
      <div className="d-flex d-md-none align-items-center">
        <Sidecart />
      </div>

    </Container>
  );
};

export default HomeHeader;
