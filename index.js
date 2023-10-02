import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

(async () => {
    // Connect to cluster and generate two new Keypairs
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const fromWallet = Keypair.generate();
const toWallet = Keypair.generate();

    

   // Airdrop SOL into your from wallet
const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
// Wait for airdrop confirmation
await connection.confirmTransaction(fromAirdropSignature, { commitment: "confirmed" });

    
    //Create new token mint and get the token account of the fromWallet address
//If the token account does not exist, create it
const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
)

    
    
   //Mint a new token to the from account
let signature = await mintTo(
	connection,
	fromWallet,
	mint,
	fromTokenAccount.address,
	fromWallet.publicKey,
	1000000000,
	[]
);
console.log('mint tx:', signature);

const toTokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	fromWallet,
	mint,
	toWallet.publicKey
);

// Transfer the new token to the "toTokenAccount" we just created
signature = await transfer(
	connection,
	fromWallet,
	fromTokenAccount.address,
	toTokenAccount.address,
	fromWallet.publicKey,
	1000000000,
	[]
);
console.log('transfer tx:', signature);

 
})();
