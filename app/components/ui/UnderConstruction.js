import { Wrench } from 'lucide-react';
import { EmptyState } from './EmptyState';

export function UnderConstruction({ 
  title = "Under Construction", 
  message = "This section will be available in the next release." 
}) {
  return (
    <EmptyState 
      icon={<Wrench />}
      title={title}
      message={message}
      className="h-64"
    />
  );
}

export default UnderConstruction;
