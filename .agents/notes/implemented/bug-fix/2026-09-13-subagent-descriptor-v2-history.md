# Agent Note: Released subagent descriptor v2 history

Status: implemented

English | [中文](2026-09-13-subagent-descriptor-v2-history.zh.md)

## Problem

A released child log can contain descriptor version 2 while the session-format migration validates descriptors against version 3. Rejecting that record prevents history restoration; accepting migration alone leaves cold continuation unable to classify the child.

## Decision

The historical payload validator admits the exact version 2 shape, which lacks version 3's optional reasoning-effort field. The subagent descriptor folder validates the same shape and returns a detached current descriptor in memory. Migration preserves the stored payload and never invents a reasoning effort.

## Alternatives considered

Rewriting stored version numbers would modify user history unnecessarily. Accepting arbitrary descriptor versions would hide unaudited composition differences. Relaxing only migration validation would leave cold resume broken.

## Consequences

Released histories remain readable and continuable without a storage migration. Malformed version 2 records and unsupported future versions retain their existing rejection or unclassified behavior.
