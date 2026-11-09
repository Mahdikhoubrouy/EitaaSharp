using Account = EitaaSharp.Schema.Account;
using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Reads privacy rules for one key (e.g. last-seen).</summary>
    public Task<Account.IPrivacyRules> GetPrivacyAsync(
        Schema.IInputPrivacyKey key, CancellationToken cancellationToken = default)
        => CallAsync(new Account.GetPrivacy { Key = key }, cancellationToken);

    /// <summary>Replaces privacy rules for one key.</summary>
    public Task<Account.IPrivacyRules> SetPrivacyAsync(
        Schema.IInputPrivacyKey key, IReadOnlyList<Schema.IInputPrivacyRule> rules,
        CancellationToken cancellationToken = default)
        => CallAsync(new Account.SetPrivacy { Key = key, Rules = rules.ToArray() }, cancellationToken);
}
