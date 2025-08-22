import React from 'react';
import { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Link from 'next/link';
import { SEOHead } from '@/components/atoms/seo-head/seo-head';
import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import {
  Container,
  Content,
  ErrorCode,
  Title,
  Description,
  Actions,
} from '@/styles/pages/404.style';

// 404 страница - когда даже Dyson не может найти то, что вы ищете
const Custom404: NextPage = () => {
  const seoProps = {
    title: 'Страница не найдена - DyStore',
    description:
      'Запрашиваемая страница не найдена. Вернитесь на главную страницу или воспользуйтесь поиском.',
    noindex: true,
    nofollow: true,
  };

  return (
    <>
      <SEOHead {...seoProps} />

      <Container>
        <Content
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ErrorCode
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            404
          </ErrorCode>

          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Страница не найдена
          </Title>

          <Description
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            К сожалению, страница которую вы ищете не существует. Возможно, она была перемещена или
            удалена. Но не переживайте — у нас есть много других интересных товаров!
          </Description>

          <Actions
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/">
              <Button size="large">На главную</Button>
            </Link>
            <Link href="/category/vacuum-cleaners">
              <Button size="large" variant={ButtonVariant.OUTLINE}>
                Каталог товаров
              </Button>
            </Link>
          </Actions>
        </Content>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
};

export default Custom404;
