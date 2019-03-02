import React from 'react';
import { CardContent, Slide, Card, Typography, Input } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';

export default ({
  name,
  description,
  isTodoBeingEdited,
  newDescription,
  onFinishEdit,
  onStartEdit,
  onEditDescription,
  onDelete
}) => (
  <div style={{ padding: 4 }}>
    <Slide direction="right" in>
      <Card>
        <CardContent>
          <Typography onClick={onFinishEdit} variant="subheading">
            {name}
            <EditOutlinedIcon
              style={{ float: 'right', padding: 4 }}
              onClick={onStartEdit}
            />
            <DeleteOutlinedIcon
              style={{ float: 'right', padding: 4 }}
              onClick={onDelete}
            />
            {isTodoBeingEdited && (
              <OfflineBoltOutlinedIcon style={{ float: 'right', padding: 4 }} />
            )}
          </Typography>
          {isTodoBeingEdited ? (
            <Input
              autoFocus
              placeholder="Describe your to do..."
              onChange={onEditDescription}
              onBlur={onFinishEdit}
              value={newDescription}
              fullWidth
            />
          ) : (
            <Typography onClick={onStartEdit}>
              {description || 'Description goes here...'}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Slide>
  </div>
);
