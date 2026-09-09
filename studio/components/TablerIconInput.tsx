import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {type StringInputProps, set, unset} from 'sanity'
import {TABLER_NAV_ICONS} from '../lib/tablerIcons'

export function TablerIconInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props

  return (
    <Stack space={3}>
      <Flex gap={2} wrap="wrap">
        {TABLER_NAV_ICONS.map((option) => {
          const selected = value === option.value
          const Icon = option.icon

          return (
            <Card
              key={option.value}
              as="button"
              type="button"
              padding={3}
              radius={2}
              shadow={selected ? 1 : 0}
              tone={selected ? 'primary' : 'default'}
              disabled={readOnly}
              onClick={() => onChange(selected ? unset() : set(option.value))}
              style={{cursor: readOnly ? 'default' : 'pointer', border: 'none'}}
            >
              <Stack space={2} style={{alignItems: 'center', minWidth: 64}}>
                <Icon size={20} stroke={1.75} />
                <Text size={0} align="center">
                  {option.title}
                </Text>
              </Stack>
            </Card>
          )
        })}
      </Flex>
      {value ? (
        <Box>
          <Text size={1} muted>
            Selected: {value}
          </Text>
        </Box>
      ) : null}
    </Stack>
  )
}
