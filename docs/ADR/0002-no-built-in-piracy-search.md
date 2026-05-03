# ADR-0002: No built-in torrent search or piracy index integrations

## Status
Accepted for v1.

## Context
A torrent client is legal technology, but built-in scraping/search against infringing indexes can create legal and reputation risk.

## Decision
v1 supports user-provided `.torrent` files and magnet links only. The app will not ship built-in piracy search, scraping, copyrighted-content recommendations, or index plugins.

## Consequences
- Product positioning stays professional: Linux ISOs, open-source releases, public datasets, Creative Commons media, and legal distribution.
- Support burden is reduced.
- Plugin architecture, if added later, must include policy and safety review.
