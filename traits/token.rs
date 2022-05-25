use brush::contracts::traits::{
    access_control::*,
    psp22::{extensions::burnable::*, extensions::metadata::*, extensions::mintable::*, *},
};

#[brush::wrapper]
pub type TokenRef = dyn PSP22 + PSP22Metadata + PSP22Burnable + PSP22Mintable + AccessControl;

#[brush::trait_definition]
pub trait Token: PSP22 + PSP22Metadata + PSP22Burnable + PSP22Mintable + AccessControl {}
