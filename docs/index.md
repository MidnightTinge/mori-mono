# Mori
### Overview

Mori is an application for chronicling small tidbits of information for future 
use. The name comes from the japanese word for forest, and the navigational
architecture is built around this notion of a group of trees.

Your main container for links or notes are "forests". Inside each forest is a
group of "trees" which themselves can be the deepest level you ever go. A tree
is a URL, or note, or combination thereof that is being stored for future use.

A `tree` only has one main field: `content`. This content field is used to store
whatever you want, and things like smart URL embeds are sniffed from any links
inside the content. The aim is to keep the content field as freeform as possible
to allow maximum freedom for the user.

### Architecture
