import { Button, Html } from '@react-email/components';
import * as React from 'react';

 export function Email(props: { url: string }) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}
