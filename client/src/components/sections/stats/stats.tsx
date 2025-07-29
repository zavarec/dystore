import React from 'react';
import {
  StatsContainer,
  Container,
  StatsGrid,
  StatItem,
  StatNumber,
  StatLabel,
} from './stats.style';

interface StatData {
  number: string;
  label: string;
}

interface StatsProps {
  stats: StatData[];
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <StatsContainer>
      <Container>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </Container>
    </StatsContainer>
  );
};
