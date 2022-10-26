import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { ChatState } from "../context/ChatProvider";

const ScrollableChats = ({ messages }) => {
  const { user } = ChatState();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div style={{ paddingBottom: "15px" }}>
        {messages &&
          messages.map((m, i) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: isSameUser(messages, m, i, user._id) ? 5 : 20,
              }}
              key={m._id}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom" hasArrow>
                  <Avatar
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#36373b" : "#ed8c4b"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  borderRadius: "5px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  fontSize: "16px",
                  fontFamily: "Arial",
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScrollableChats;
