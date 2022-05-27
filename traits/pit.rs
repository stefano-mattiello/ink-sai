use brush::traits::AccountId;

#[brush::wrapper]
pub type PitTraitRef = dyn PitTrait;

#[brush::trait_definition]
pub trait PitTrait {
    #[ink(message)]
    fn burn(&self, gem_address: AccountId);
}
