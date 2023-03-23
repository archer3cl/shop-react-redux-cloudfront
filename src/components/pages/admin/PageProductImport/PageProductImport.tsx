import API_PATHS from '~/constants/apiPaths';
import ProductsTable from '~/components/pages/admin/PageProductImport/components/ProductsTable';
import CSVFileImport from '~/components/pages/admin/PageProductImport/components/CSVFileImport';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle, Typography } from '@mui/material';
import { useState } from 'react';

export default function PageProductImport() {
  const [authError, setAuthError] = useState<{
    statusCode: number;
    message: string;
  } | null>(null);
  const onAuthError = (statusCode: number, message: string) => {
    setAuthError({ statusCode, message });
  };

  return (
    <Box py={3}>
      {authError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>
            <Typography variant="h6">{authError.statusCode}</Typography>
          </AlertTitle>
          {authError.message}
        </Alert>
      ) : null}
      <Box mb={2} display="flex" justifyContent="space-between">
        <CSVFileImport
          url={`${API_PATHS.import}/import`}
          title="Import Products CSV"
          resetError={() => setAuthError(null)}
          onAuthError={onAuthError}
        />
        <Button
          size="small"
          color="primary"
          variant="contained"
          sx={{ alignSelf: 'end' }}
          component={Link}
          to={'/admin/product-form'}
        >
          Create product
        </Button>
      </Box>
      <ProductsTable />
    </Box>
  );
}
