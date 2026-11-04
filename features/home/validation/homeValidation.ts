import { HomePayload } from '../types';

export interface ValidationErrors {
  title?: string;
  price?: string;
  bedrooms?: string;
  bathrooms?: string;
  area_sqft?: string;
  location?: string;
}

export function validateHomeForm(values: Partial<HomePayload>): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  if (!values.title || values.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (values.title.length > 255) {
    errors.title = 'Title must be 255 characters or fewer';
  }

  if (values.price !== undefined && values.price !== '' && values.price !== null) {
    const priceNum = Number(values.price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.price = 'Price must be a positive number';
    }
  }

  if (values.bedrooms !== undefined && values.bedrooms !== null) {
    const beds = Number(values.bedrooms);
    if (isNaN(beds) || beds < 0 || !Number.isInteger(beds)) {
      errors.bedrooms = 'Bedrooms must be a positive integer';
    }
  }

  if (values.bathrooms !== undefined && values.bathrooms !== null) {
    const baths = Number(values.bathrooms);
    if (isNaN(baths) || baths < 0 || !Number.isInteger(baths)) {
      errors.bathrooms = 'Bathrooms must be a positive integer';
    }
  }

  if (values.area_sqft !== undefined && values.area_sqft !== null) {
    const sqft = Number(values.area_sqft);
    if (isNaN(sqft) || sqft < 0 || !Number.isInteger(sqft)) {
      errors.area_sqft = 'Area must be a positive integer';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

