import {
  Body,
  Heading,
  Link,
  Tailwind,
  Text
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className='text-black'>
          <Heading>Reset password</Heading>
          <Text>
            Hello! You requested password reset. Please, follow the link to create a new password
          </Text>
          <Link href={resetLink}>Confirm password reset</Link>
          <Text>This link is available during an hour</Text>
        </Body>
      </Html>
    </Tailwind>
  );
}