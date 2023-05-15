import React from 'react';
import { useParams } from 'react-router';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useModelState } from '../../../misc/custom-hook';
import { functions } from '../../../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
  title: StringType().isRequired('Title is required'),
  message: StringType().isRequired('Message is required'),
});

const INITIAL_FORM = {
  title: '',
  message: '',
};

const SendFcmBtnModal = () => {
  const { isOpen, open, close } = useModelState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const { chatId } = useParams();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);

    try {
      const sendFcm = functions.httpsCallable('sendFcm');
      await sendFcm({ chatId, ...formValue });
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
      Alert.info('Notification has been sent', 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };

  return (
    <>
      <Button appearance="primary" size="xs" onClick={open}>
        <Icon icon="podcast" className="mr-2" />
        Broadcast Message
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Send Notifications to room users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl
                name="title"
                placeholder="Enter chat room title..."
              ></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Messsage</ControlLabel>
              <FormControl
                componentClass="textarea"
                name="message"
                rows={5}
                placeholder="Enter notification message..."
              ></FormControl>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Publish Message
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendFcmBtnModal;
