import React from 'react'
import { Card, Image, Text, Badge, Button, Group, Progress } from '@mantine/core';

const Medal = ({ medalName, medalScore, verified, userScore }) => {

  const getPercentage = () => {
    if (medalScore == 0) {
      return 100;
    }
    return Math.round(Math.min(userScore * 100 / medalScore, 100));
  }
  
  return (
   <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Progress color="green" value={getPercentage()} striped animated />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
          { verified? '🏆' : '🔜' }
        <Text fw={700}>{ medalName }</Text>
        {
          verified
          ? <Badge color="green">{ 'Verificado' }</Badge>
          : <Badge color="gray">{ 'Por verificar' }</Badge>
        }
      </Group>

      <Text fw={500}>{ `${getPercentage()}%` }</Text>
      <Text size="sm" c="dimmed">

        Puntaje: {userScore}/{medalScore}
      </Text>

      {/* <Button color="blue" fullWidth mt="md" radius="md"> */}
      {/**/}
      {/* </Button> */}
    </Card>
  )
}

export default Medal;
