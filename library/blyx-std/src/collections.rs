pub use std::collections::{HashMap, HashSet, BTreeMap, BTreeSet, VecDeque, LinkedList};
pub use std::collections::hash_map::Entry;

pub struct OrderedMap<K: Eq, V> {
    items: Vec<(K, V)>,
}

impl<K: Eq + Clone, V> Default for OrderedMap<K, V> {
    fn default() -> Self {
        Self::new()
    }
}

impl<K: Eq + Clone, V> OrderedMap<K, V> {
    pub fn new() -> Self {
        Self { items: Vec::new() }
    }

    pub fn insert(&mut self, key: K, val: V) -> Option<V> {
        for item in &mut self.items {
            if item.0 == key {
                let old = std::mem::replace(&mut item.1, val);
                return Some(old);
            }
        }
        self.items.push((key, val));
        None
    }

    pub fn get(&self, key: &K) -> Option<&V> {
        for item in &self.items {
            if &item.0 == key {
                return Some(&item.1);
            }
        }
        None
    }

    pub fn remove(&mut self, key: &K) -> Option<V> {
        let mut idx = None;
        for (i, item) in self.items.iter().enumerate() {
            if &item.0 == key {
                idx = Some(i);
                break;
            }
        }
        if let Some(i) = idx {
            Some(self.items.remove(i).1)
        } else {
            None
        }
    }

    pub fn iter(&self) -> impl Iterator<Item=(&K, &V)> {
        self.items.iter().map(|(k, v)| (k, v))
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    pub fn contains_key(&self, key: &K) -> bool {
        self.get(key).is_some()
    }

    pub fn keys(&self) -> impl Iterator<Item=&K> {
        self.items.iter().map(|(k, _)| k)
    }

    pub fn values(&self) -> impl Iterator<Item=&V> {
        self.items.iter().map(|(_, v)| v)
    }
}
