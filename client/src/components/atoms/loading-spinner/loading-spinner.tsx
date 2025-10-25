import { LoadingSpinnerStyled } from './loading-spinner.style';

interface LoadingSpinnerProps {
  message?: string;
  height?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height = '100vh' }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height,
      fontSize: '18px',
      color: '#666',
    }}
  >
    <>
      <LoadingSpinnerStyled />
    </>
  </div>
);
