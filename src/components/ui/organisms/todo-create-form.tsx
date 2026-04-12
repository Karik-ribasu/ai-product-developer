"use client";

import { useState } from "react";
import styled from "styled-components";

import { BodyText } from "../atoms/body-text";
import { Button } from "../atoms/button";
import { SectionHeading } from "../atoms/heading";
import { Spinner } from "../atoms/spinner";
import { TextField } from "../atoms/text-field";
import { ErrorBanner } from "../molecules/error-banner";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

type TodoCreateFormProps = {
  onCreate: (title: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export function TodoCreateForm({ onCreate, loading, error }: TodoCreateFormProps) {
  const [title, setTitle] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    const ok = await onCreate(trimmed);
    if (ok) {
      setTitle("");
    }
  };

  return (
    <Form onSubmit={submit} noValidate>
      <SectionHeading>New todo</SectionHeading>
      <BodyText as="label" htmlFor="new-todo-title">
        Title
      </BodyText>
      <TextField
        id="new-todo-title"
        name="title"
        value={title}
        disabled={loading}
        placeholder="What needs to be done?"
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "create-todo-error" : undefined}
      />
      {error ? (
        <div id="create-todo-error">
          <ErrorBanner message={error} />
        </div>
      ) : null}
      <Row>
        <Button type="submit" disabled={loading || !title.trim()}>
          {loading ? (
            <>
              <Spinner size="sm" label="Creating todo" />
              Creating…
            </>
          ) : (
            "Add todo"
          )}
        </Button>
      </Row>
    </Form>
  );
}
