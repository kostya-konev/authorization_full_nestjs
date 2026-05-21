import {
  Body,
  Heading,
  Tailwind,
  Text
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface TwoFactorAuthTemplateProps {
  token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
  return (
    <Tailwind>
      <Html>
        <Body className='text-black'>
          <Heading>2-FA authentication</Heading>
          <Text>Your code of 2-FA <strong>{token}</strong></Text>
          <Text>
            Пожалуйста, введите этот код в приложении для завершения процесса аутентификации.
            Please, enter this code in the app to complete authentication
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}