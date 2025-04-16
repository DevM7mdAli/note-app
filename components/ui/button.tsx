import React, { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';
import TextFont from './text';

interface CustomPressableProps extends PressableProps {
  className?: string;
  children?: ReactNode;
  functionality: () => void;
}

const Btn = ({ children , className , functionality } : CustomPressableProps) => {
  return (
    <Pressable 
    className={`${className} bg-accent p-5 rounded-2xl`}
    onPress={functionality}
    hitSlop={10}
    >
      <TextFont className='text-secondary text-xl'>
        {children}
      </TextFont>
    </Pressable>
  );
}

export const TextBtn = ({ children , className , functionality } : CustomPressableProps) => (
          <Pressable 
          hitSlop={10}
          className={`${className} p-5`}
          onPress={functionality}
          >
            <TextFont className='text-secondary text-xl'>
              {children}
            </TextFont>
          </Pressable>
  
)

export default Btn;