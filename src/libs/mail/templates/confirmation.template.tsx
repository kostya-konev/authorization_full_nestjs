import { Html } from "@react-email/html";
import { Body, Heading, Link, Text } from '@react-email/components';
import * as React from "react";

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({ domain, token }: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Html>
      <Body>
        <Heading>Email confirmation</Heading>
        <Text>
          Hello! To confirm you email address, please follow the link
        </Text>
        <Link href={confirmLink}>Confirm email</Link>
        <Text>This link is available during an hour</Text>
        <Text>Thanks for using our service!</Text>
      </Body>
    </Html>
  )
}