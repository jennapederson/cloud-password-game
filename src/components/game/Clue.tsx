import { Message, View } from "@aws-amplify/ui-react";

export default function Clue({text} : { text: string}) {
  return (
    <View width="40vw" className="clue-message">
      <Message colorTheme="neutral">{text}</Message>
    </View>
  )
}