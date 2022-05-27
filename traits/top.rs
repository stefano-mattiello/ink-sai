use crate::traits::tap::*;
use crate::traits::tub::*;
use brush::contracts::traits::access_control::*;
use brush::contracts::traits::psp22::*;
use brush::traits::Timestamp;

#[brush::wrapper]
pub type TopTraitRef = dyn TopTrait + AccessControl;

#[brush::trait_definition]
pub trait TopTrait: AccessControl {
    #[ink(message)]
    fn era(&self) -> Timestamp;
    #[ink(message)]
    fn fix(&self) -> u128;
    #[ink(message)]
    fn fit(&self) -> u128;

    fn cage_at_price(&mut self, price: u128) -> Result<(), TopError>;

    #[ink(message)]
    fn cage(&mut self) -> Result<(), TopError>;

    #[ink(message)]
    fn flow(&mut self) -> Result<(), TopError>;

    #[ink(message)]
    fn set_cooldown(&mut self, cooldown: u64) -> Result<(), TopError>;
}

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum TopError {
    InvalidCage,
    InvalidFlow,
    TubError(TubError),
    PSP22Error(PSP22Error),
    TapError(TapError),
    AccessControlError(AccessControlError),
}
impl From<AccessControlError> for TopError {
    fn from(access: AccessControlError) -> Self {
        TopError::AccessControlError(access)
    }
}
impl From<TubError> for TopError {
    fn from(error: TubError) -> Self {
        TopError::TubError(error)
    }
}
impl From<TapError> for TopError {
    fn from(error: TapError) -> Self {
        TopError::TapError(error)
    }
}
impl From<PSP22Error> for TopError {
    fn from(error: PSP22Error) -> Self {
        TopError::PSP22Error(error)
    }
}
